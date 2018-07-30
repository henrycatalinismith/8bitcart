module Gallery
  class CartsController < GalleryController
    def new
      @cart = Cart.new(
        :lua => [
          "-- hi there :)",
          "-- here's some code to get you started!",
          "line(0, 0, 127, 127, 12)",
          "",
          "-- hit ▶️ Run to see it in action!",
        ].join("\n")
      )
    end

    def get
      @address = params[:address][2 .. params[:address].length]
      @cart = Cart.find_by(address: @address)
    end

    def screenshot
      @address = params[:address][2 .. params[:address].length]
      @cart = Cart.find_by(address: @address)

      @snapshot = @cart.snapshots.last
      if !@snapshot.nil?
        redirect_to url_for(@snapshot), status: 302
        return
      end

      bundle_name = "snapshot.js"
      manifest = Webpacker.manifest.lookup(bundle_name)
      filename = Rails.root.join(File.join("public", manifest)).to_s
      javascript = [
        "const lua = `#{@cart.lua}`;",
        File.read(filename),
      ].join("\n")

      colors = [
        "#0e0e0e",
        "#1D2B53",
        "#7E2553",
        "#008751",
        "#AB5236",
        "#5F574F",
        "#C2C3C7",
        "#FFF1E8",
        "#FF004D",
        "#FFA300",
        "#FFEC27",
        "#00E436",
        "#29ADFF",
        "#83769C",
        "#FF77A8",
        "#FFCCAA",
      ];

      pixels = {}
      context = MiniRacer::Context.new(timeout: 3000)
      context.attach("update", proc{|p| pixels = p })
      context.eval(javascript)

      @png = ChunkyPNG::Image.new(128, 128, ChunkyPNG::Color::BLACK)

      pixels.each_index do |x|
        pixels[x].each_index do |y|
          color = colors[pixels[x][y]]
          @png[x, y] = ChunkyPNG::Color.from_hex(color)
        end
      end

      tempfile = Tempfile.new("fileupload")
      tempfile.binmode
      tempfile.write(@png)
      tempfile.rewind()

      @snapshot = @cart.snapshots.attach(
        io: tempfile,
        filename: "#{@address}.png",
        content_type: "image/png",
      )

      @cart.save

      redirect_to url_for(@snapshot), status: 302
    end
  end
end
