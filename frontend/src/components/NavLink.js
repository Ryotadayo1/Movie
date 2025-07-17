import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavLink({ href, children }) {
  const router = useRouter();

  const isActive = router.pathname === href;
  const className = isActive
    ? 'border-b-2 border-blue-500 px-4 py-2 text-blue-600'
    : 'px-4 py-2 text-gray-600 hover:text-blue-600';

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
