// Ported from JT_dashboard/src/lib/Flow/constants.ts. `server_address` is gone:
// the data comes from the static snapshot in ../../api.ts.
export const initial_to_id_dict: Record<string, number> = {
  AS: 124,
  BB: 59,
  CE: 86,
  DH: 80,
  GS: 193,
  JB: 46,
  JD: 9,
  JL: 37,
  KT: 87,
  LL: 171,
  ML: 194,
  MM: 14,
  OM: 96,
  PH: 157,
  SB: 57,
  SC: 5,
  TP: 91,
  TS: 49,
  VG: 27,
}
export const participant_column_id = 'participant-'
export const category_column_id = 'category-'
export const factor_column_id = 'factor-category-'
export const strategy_column_id = 'strategy-'
export const fairness_column_id = 'rect-'
export const represented_column_id = 'represented-'
export const not_represented_column_id = 'not-represented-'
export const others_column_id = 'others-to-include-'
export const category_process_func = (category: string) => {
  return category.toLowerCase().replaceAll(' ', '-')
}
export const column_id_to_title: Record<string, string> = {
  [participant_column_id]: 'Participant',
  [category_column_id]: 'Categories',
  [factor_column_id]: 'Factors',
  [strategy_column_id]: 'Strategies',
  [fairness_column_id]: 'Fairness',
  [represented_column_id]: 'Involved Groups',
  [not_represented_column_id]: 'Overlooked Groups',
  [others_column_id]: 'Others to Include',
}
export const column_can_add: Record<string, boolean> = {
  [participant_column_id]: false,
  [category_column_id]: false,
  [factor_column_id]: true,
  [strategy_column_id]: false,
  [fairness_column_id]: false,
  [represented_column_id]: true,
  [not_represented_column_id]: true,
  [others_column_id]: true,
}
const section_ids = {
  participant: 'participant',
  background: 'background',
  drivers_of_change: 'drivers_of_change',
  future_management: 'future_management',
  decision_making: 'decision_making',
}
export const column_to_section_dict: Record<string, string> = {
  [participant_column_id]: section_ids.participant,
  [category_column_id]: section_ids.background,
  [factor_column_id]: section_ids.drivers_of_change,
  [strategy_column_id]: section_ids.future_management,
  [fairness_column_id]: section_ids.decision_making,
  [represented_column_id]: section_ids.decision_making,
  [not_represented_column_id]: section_ids.decision_making,
  [others_column_id]: section_ids.decision_making,
}
export const column_to_options_dict: Record<string, string> = {
  [category_column_id]: 'participant_categories',
  [factor_column_id]: 'factor_categories',
  [strategy_column_id]: 'strategy_categories',
  [fairness_column_id]: fairness_column_id,
  [represented_column_id]: 'represented_categories',
  [not_represented_column_id]: 'not_represented_categories',
  [others_column_id]: 'others_to_include_categories',
}
export const column_to_participant_data_key: Record<string, string> = {
  [category_column_id]: 'categories',
  [factor_column_id]: 'factors',
  [strategy_column_id]: 'strategies',
  [fairness_column_id]: 'fairness',
  [represented_column_id]: 'represented_groups',
  [not_represented_column_id]: 'not_represented_groups',
  [others_column_id]: 'others_to_include',
}
