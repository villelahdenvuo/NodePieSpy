module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodeunit: {
      all: ['test/**/*.js']
    },
    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.test.js'],
      options: {
        "eqeqeq": true,
        "laxcomma": true
      }
    },
    jsdoc : {
      dist : {
        src: ['README.md', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },
  watch: {
    scripts: {
      files: ['lib/**/*.js', 'test/**/*.js'],
      tasks: ['jshint', 'jsdoc'],
      options: {
        spawn: false,
      },
    },
  }/*,
  'gh-pages': {
    options: {
      base: 'doc',
      repo: 'git@github.com:tuhoojabotti/NodePieSpy.git'
    },
    src: ['**']
  }*/
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  //grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('default', ['jshint', 'nodeunit', 'jsdoc']);
};