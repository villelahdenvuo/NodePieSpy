module.exports = function (grunt) {

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
    jsdoc: {
      all: {
        src: ['README.md', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          destination: 'doc',
          configure: 'jsdoc.json'
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
  },
  copy: {
    docs: {
      files: [
          {expand: true, cwd: 'doc/', src: ['**'], dest: '_doc/'},
          {expand: true, src: ['media/**'], dest: '_doc/'}
      ]
    }
  },
  githubPages: {
    docs: {
      options: {
        commitMessage: 'Update doc.'
      },
      src: '_doc'
    }
  }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-github-pages');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('docs', ['jsdoc', 'copy:docs', 'githubPages:docs']);
  grunt.registerTask('default', ['jshint', 'nodeunit']);
  grunt.registerTask('test', ['jshint', 'nodeunit']);
};