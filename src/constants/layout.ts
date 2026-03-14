import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const Layout = {
  keypadButtonSize: wp('22%'),
  keypadGap: wp('2.5%'),
  inputWidth: wp('55%'),
  inputHeight: hp('7%'),
  screenPadding: wp('8%'),
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
  },
  fontSize: {
    xs: wp('3%'),
    sm: wp('3.5%'),
    md: wp('4.5%'),
    lg: wp('6%'),
    xl: wp('8%'),
    xxl: wp('12%'),
  },
} as const;

export { wp, hp };
