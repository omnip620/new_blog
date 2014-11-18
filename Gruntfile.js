module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        recess: {
            options: {
                compile: true
            },
            files:[{

                src:['public/stylesheets/style.css'],
                dest: 'public/stylesheets/style1.css', // lose the brackets
                ext:'.css'
            }]
//            dist: {
//                src: ['public/stylesheets/style.css']
//            }
        },
        watch: {
            files: ['public/**/*.css','public/**/*.js','views/**/*'],
            options: {
                livereload: true
            }
        }
    });

    // 加载包含插件。
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    // 默认被执行的任务列表。
    grunt.registerTask('default', ['watch','recess']);

};
