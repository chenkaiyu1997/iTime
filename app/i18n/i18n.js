/**
 * Created by kylechen on 17-6-8.
 */
import I18n from 'react-native-i18n'
import en from './en.js'
import cn from './cn.js'

I18n.fallbacks = true;

I18n.translations = {
  en, cn
};
export default I18n;