import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-3 font-display text-xl font-bold text-ink dark:text-ink-dark">Stumped — that page doesn't exist</h1>
      <p className="mt-2 text-sm text-ink-soft dark:text-ink-darksoft">Let's get you back to the crease.</p>
      <Button as={Link} to="/" className="mt-6">
        Back to home
      </Button>
    </div>
  );
}