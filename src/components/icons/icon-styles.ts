import { css } from 'lit';

import theme from '../../theme';

export const baseSvgIconStyles = css`
    svg {
        width: 28px;
        fill: ${theme.colors.text};
        cursor: pointer;
    }
`;
