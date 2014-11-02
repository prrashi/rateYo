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

    , uglify: {
        minify: {
          files: {
            '<%= config.minDir %><%= config.name %>.min.js': ['<%= config.srcDir %><%= config.name %>.js']
          }
        }
      }

    , cssmin: {
        minify: {
          files: {
            '<%= config.minDir %><%= config.name %>.min.css': ['<%= config.srcDir %><%= config.name %>.css']
          }
        }
      }
  });

  grunt.registerTask('build', ['uglify:minify', 'cssmin:minify']);
  grunt.registerTask('default', 'build');
};
