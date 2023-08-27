import { AdminState } from './admin.reducer';

export const selectAdminState = (state: { state: AdminState }) => state.state
