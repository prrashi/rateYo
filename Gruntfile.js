module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var config = {
      srcDir: 'src/'
    , minDir: 'min/'
    , name: 'jquery.rateyo'
  };

  grunt.initConfig({
      config: config
    , pkg: grunt.file.readJSON('package.json')
    , options: {

        "banner": '/*<%= pkg.name %> V<%= pkg.version %>, <%= pkg.description %>\n<%= pkg.author %>*/'
      }
    , uglify: {
        minify: {
            options: {
                banner: '<%= options.banner %>'
              , sourceMap: true
              , drop_console: true
              , mangle: {
                  except: ['jQuery']
                }
            }
          , files: {
              '<%= config.minDir %><%= config.name %>.min.js': ['<%= config.srcDir %><%= config.name %>.js']
            }
        }
      }
    , less: {
          minify: {
            options: {
                cleancss: true
              , sourceMap: true
              , sourceMapFilename: '<%= config.minDir %><%= config.name %>.min.css.map'
            }
          , files: {
              '<%= config.minDir %><%= config.name %>.min.css': ['<%= config.srcDir %><%= config.name %>.less']
            }
        }
        , build: {
            files: {
              '<%= config.srcDir%><%= config.name %>.css': ['<%= config.srcDir %><%= config.name %>.less']
            }
        }
      }
    , jshint: {
          options: {
            jshintrc: true,
            reporterOutput: ""
          }
        , files: ["<%= config.srcDir %><%= config.name %>.js"]
      }
    , watch: {
          scripts: {
              files: ['<% jshint.files %>']
            , tasks: ['jshint']
        }
        , styles: {
              files: ['<%= config.srcDir %><%= config.name %>.less']
            , tasks: ['less']
        }
    }
  });

  grunt.registerTask('test', 'jshint');
  grunt.registerTask('build', ['test', 'uglify', 'less']);
  grunt.registerTask('default', 'build');
};
