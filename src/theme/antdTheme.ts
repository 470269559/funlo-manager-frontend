import type { ThemeConfig } from 'antd'
import { themeTokens } from './tokens'

export const antdTheme: ThemeConfig = {
  token: {
    colorBgLayout: themeTokens.backgroundColor,
    colorBorder: themeTokens.borderColor,
    colorError: themeTokens.dangerColor,
    colorPrimary: themeTokens.primaryColor,
    colorText: themeTokens.textColor,
    colorTextSecondary: themeTokens.textMutedColor,
    borderRadius: themeTokens.borderRadius,
    controlHeight: themeTokens.controlHeight,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    Button: {
      borderRadius: themeTokens.borderRadius,
      controlHeight: themeTokens.controlHeight,
      fontWeight: 700,
      primaryShadow: 'none',
    },
    Card: {
      borderRadiusLG: themeTokens.borderRadius + 2,
    },
    Input: {
      borderRadius: themeTokens.borderRadius,
    },
    Modal: {
      borderRadiusLG: themeTokens.borderRadius + 2,
    },
    Select: {
      borderRadius: themeTokens.borderRadius,
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: themeTokens.textMutedColor,
      rowHoverBg: '#fafafa',
    },
  },
}
