import { Link } from 'react-router-dom';
import { StudentListRoute } from '../../routes';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900">
      <Link to={StudentListRoute.path}>学生列表</Link>
    </div>
  );
}