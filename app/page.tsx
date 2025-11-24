import { redirect } from 'react-router'

/**
 * Index Route (/)
 * 
 * Redirect to login page
 */
export async function loader() {
  return redirect('/login');
}

export default function IndexPage() {
  return null;
}
