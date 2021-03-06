import { css } from 'emotion';

import { colors, fonts, breakpoints } from 'components/common/styles';

const stylesGenerator = () => ({
  base: css`
    top: 25%;
    right: 0;
    left: 0;
    margin: auto;
    position: absolute;
    width: 440px;
    height: auto;
    background: ${colors.DARK_GREY};
    pointer-events: all;
    font-family: ${fonts.secondary};
    letter-spacing: 0.7;
    color: ${colors.WHITE};

    ${breakpoints.mobile} {
      width: 400px;
    }
  `
});

export default stylesGenerator;
