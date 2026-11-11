// Ported from JT_dashboard/src/lib/Flow/constants.ts. `server_address` is gone:
// the data comes from the static snapshot in ../../api.ts.
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
export const column_to_participant_data_key: Record<string, string> = {
  [category_column_id]: 'categories',
  [factor_column_id]: 'factors',
  [strategy_column_id]: 'strategies',
  [fairness_column_id]: 'fairness',
  [represented_column_id]: 'represented_groups',
  [not_represented_column_id]: 'not_represented_groups',
  [others_column_id]: 'others_to_include',
}
