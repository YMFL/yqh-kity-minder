import jquery from 'jquery'




import _CodeMirror from 'codemirror'
import marked from 'marked'

import kityMinder from './minder.vue'

import './component/diy'

window.CodeMirror = _CodeMirror
window.marked = marked
window.$ = jquery;
window.jquery = 'jquery';
window.jQuery = 'jquery';

kityMinder.install = function (Vue) {
  Vue.component(kityMinder.name, kityMinder)
}

export default kityMinder
