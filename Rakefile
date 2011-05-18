# automates minifying jquery.isotope.js
# requires Google Closure Compiler http://code.google.com/closure/compiler/
# from command line run:
#     rake min COMPILER='path/to/compiler.jar'
file compiler = ENV["COMPILER"] || '../../resources/google-closure/compiler.jar'
js = 'jquery.masonry.js'
min_js = 'jquery.masonry.min.js'

desc "Generates #{min_js}"
task :min do
  unless File.exists?( compiler )
    puts "ERROR: Compiler not found at " + compiler
  else
    puts "Minifying jquery.masonry.js..."
    sh "java -jar #{compiler} --js #{js} --js_output_file #{min_js}"
    # Adds header comment
    min = File.read( min_js )
    File.open( min_js, 'w') do |f|
      f.write File.readlines( js )[0..8].join()
      f.write min
    end
  end
end

desc "Zips _site/ into masonry-site.zip on to Desktop"
task :zip do
  # makes isotope-site/ directory
  sh 'mkdir masonry-site;' 
  # copies _site/
  sh 'cp -r _site/ masonry-site;'
  # zips isotope-site/
  sh 'zip -r ~/Desktop/masonry-site.zip masonry-site/;' 
  # removes isotope-site/
  sh 'rm -rf masonry-site;'
end