export const initialState = {
  menuOpen: false,
  theme: 'dark',
};

export interface Action {
  type: ActionType;
  value: string;
}
export enum ActionType {
  SET_THEME = 'setTheme',
  TOGGLE_THEME = 'toggleTheme',
  TOGGLE_MENU = 'toggleMenu',
}

export function reducer(state: typeof initialState, action: Action) {
  const { type, value } = action;

  switch (type) {
    case ActionType.SET_THEME:
      return { ...state, theme: value };
    case ActionType.TOGGLE_THEME: {
      const newThemeId = state.theme === 'dark' ? 'light' : 'dark';
      return { ...state, theme: newThemeId };
    }
    case ActionType.TOGGLE_MENU:
      return { ...state, menuOpen: !state.menuOpen };
    default:
      throw new Error();
  }
}
