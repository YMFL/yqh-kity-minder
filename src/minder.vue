<template>
    <div ng-app="kityminderDemo" ng-controller="MainController">
        <h1 class="editor-title">KityMinder Editor - Powered By FEX</h1>
        <kityminder-editor on-init="initEditor(editor, minder)"></kityminder-editor>
    </div>
</template>

<script>
  import 'marked';
  import 'kity';
  import './component/bower_components/bootstrap/dist/css/bootstrap.css'
  import './component/bower_components/codemirror/lib/codemirror.css'
  import './component/bower_components/hotbox/hotbox.css'
  import 'kityminder-core/dist/kityminder.core.css'
  import './component/bower_components/color-picker/dist/color-picker.min.css'
  import './component/kityminder.editor.min.css'


  import './component/bower_components/bootstrap/dist/js/bootstrap.js';
  import './component/bower_components/angular/angular.js';
  import './component/bower_components/angular-bootstrap/ui-bootstrap-tpls.js';

  import 'codemirror';
  import 'codemirror/mode/xml/xml.js';
  import 'codemirror/mode/javascript/javascript.js';
  import 'codemirror/mode/css/css.js';
  import 'codemirror/mode/htmlmixed/htmlmixed.js';
  import 'codemirror/mode/markdown/markdown.js';
  import 'codemirror/addon/mode/overlay.js';
  import 'codemirror/mode/gfm/gfm.js';


  import './component/bower_components/angular-ui-codemirror/ui-codemirror.js';

  import './component/bower_components/hotbox/hotbox.js';
  import './component/bower_components/json-diff/json-diff.js';
  import 'kityminder-core/dist/kityminder.core.min.js';
  import './component/bower_components/color-picker/dist/color-picker.min.js';


  import './component/kityminder.editor.min.js';

  export default {
    name: 'kityMinder',
    data() {
      return {
        minder: {}
      }
    },
    props: {
      importJson: {
        type: Object,
        default: () => []
      }
    },
    watch: {
      importJson: {
        handler(val) {
          this.importData(val);
        },
        deep: true,
      }
    },

    mounted() {
      let that=this;
      angular.module('kityminderDemo', ['kityminderEditor'])
        .config(function (configProvider) {
          configProvider.set('imageUpload', '../server/imageUpload.php');
        })
        .controller('MainController', function ($scope) {
          $scope.initEditor = function (editor, minder) {
            window.editor = editor;
            window.minder = minder;
            // that.importData();
            that.addEvent()
          };
        });
    },
    methods: {
      addEvent(){
        var oldData;
        var html = '';
        html += '<a href="" class="diy export" data-type="json">导出json</a>',
          html += '<a href="" class="diy export" data-type="md">导出md</a>',
          html += '<a href="" class="diy export" data-type="km">导出km</a>',
          html += '<a href="" class="diy export" data-type="svg">导出svg</a>',
          html += '<a href="" class="diy export" data-type="txt">导出text</a>',
          html += '<a href="" class="diy export" data-type="png">导出png</a>',
          html += '<button class="diy input">',
          html += '导入<input type="file" id="fileInput" accept=".km,.txt,.md,.json" >',
          html += '</button>';

        $('.editor-title').append(html);

        $('.diy').css({
          // 'height': '30px',
          // 'line-height': '30px',
          'margin-top': '0px',
          'float': 'right',
          'background-color': '#fff',
          'min-width': '60px',
          'text-decoration': 'none',
          color: '#999',
          'padding': '0 10px',
          border: 'none',
          'border-right': '1px solid #ccc',
        });
        $('.input').css({
          'overflow': 'hidden',
          'position': 'relative',
        }).find('input').css({
          cursor: 'pointer',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'inline-block',
          opacity: 0
        });

        $(document).on('click', '.export', function (event) {
          event.preventDefault();
          var $this = $(this),
            type = $this.data('type'),
            exportType;
          switch (type) {
            case 'km':
              exportType = 'json';
              break;
            case 'md':
              exportType = 'markdown';
              break;
            case 'svg':
              exportType = 'svg';
              break;
            case 'txt':
              exportType = 'text';
              break;
            case 'png':
              exportType = 'png';
              break;
            default:
              exportType = type;
              break;
          }

          editor.minder.exportData(exportType).then(function (content) {
            switch (exportType) {
              case 'json':
                console.log($.parseJSON(content));
                break;
              default:
                console.log(content);
                break;
            }
            var blob = new Blob();
            switch (exportType) {
              case 'png':
                blob = this.dataURLtoBlob(content); //将base64编码转换为blob对象
                break;
              default:
                blob = new Blob([content]);
                break;
            }
            var a = document.createElement("a"); //建立标签，模拟点击下载
            a.download = $('#node_text1').text() + '.' + type;
            a.href = URL.createObjectURL(blob);
            a.click();

          });
        });


        var fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', function (e) {
          var file = fileInput.files[0],
            // textType = /(md|km)/,
            fileType = file.name.substr(file.name.lastIndexOf('.') + 1);
          console.log(file);
          switch (fileType) {
            case 'md':
              fileType = 'markdown';
              break;
            case 'txt':
              fileType = 'text';
              break;
            case 'km':
            case 'json':
              fileType = 'json';
              break;
            default:
              console.log("File not supported!");
              alert('只支持.km、.md、、text、.json文件');
              return;
          }
          var reader = new FileReader();
          reader.onload = function (e) {
            var content = reader.result;
            editor.minder.importData(fileType, content).then(function (data) {
              console.log(data)
              $(fileInput).val('');
            });
          }
          reader.readAsText(file);
        });
      },
      dataURLtoBlob(dataurl) {
        var arr = dataurl.split(',');
        //注意base64的最后面中括号和引号是不转译的
        var _arr = arr[1].substring(0, arr[1].length - 2);
        var mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(_arr),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
          type: mime
        });
      },
      importData(){
        console.log(this.importJson);
        window.editor.minder.importData('json', this.importJson).then(function (data) {
          console.log(data)
        });
      }
    },
  }
</script>
<style scoped>
    h1.editor-title {
        background: #393F4F;
        color: white;
        margin: 0;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        font-family: 'Hiragino Sans GB', 'Arial', 'Microsoft Yahei';
        font-weight: normal;
        padding: 0 20px;
    }

    div.minder-editor-container {
        position: absolute;
        top: 40px;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>
