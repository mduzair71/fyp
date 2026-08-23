export const API_BASE = 'http://localhost:8000';

export function persistAuth(result) {
  localStorage.setItem('user_id', result.user_id);
  localStorage.setItem('name', result.name);
  localStorage.setItem('user_name', result.name);
  localStorage.setItem('role', result.role);
  if (result.department) localStorage.setItem('department', result.department);
  if (result.district) localStorage.setItem('district', result.district);
  if (result.area) localStorage.setItem('area', result.area);
  localStorage.setItem('categories', JSON.stringify(result.categories || []));
  localStorage.setItem('areas', JSON.stringify(result.areas || []));
  localStorage.setItem('districts', JSON.stringify(result.districts || []));
}
