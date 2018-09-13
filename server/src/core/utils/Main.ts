import GenerateQuotePDF from '../../app_scripts/hooks/GenerateQuotePDF';
import TextUtils from './TextUtils';
import Utils from '@Utils';

// Utils.encrypt('admin', 10, (hash: string) => {
//   console.log(hash);
// });

// console.log(Utils.generatePassword());

Utils.sendEmail(
  ['venkatesh.vasam13@gmail.com'],
  [],
  'Your login password is generated',
  '<html><body>Hi ' +
    'vasam' +
    ', your password is generated as <b>' +
    'uioi90ioiim' +
    '</b><br/>' +
    ' <a>Click here</a> to login into your account, and reset your password<br/><br/><br/>' +
    '<i>this is an automatically generated email – please do not reply to it.</body></html></i>'
);

// GenerateQuotePDF.generate(10004);
