import { Link } from 'react-router-dom';
import mascot from '../../../assets/mascot.png';
import './Logo.css';
import { cn } from '../../../utils/cn';

export default function Logo({ size = 'sm', className }) {
  return (
    <Link to="/" className={cn('logo', `logo--${size}`, className)} aria-label="ULTRACK Home">
      <img src={mascot} alt="ULTRACK Mascot" className="logo__mascot" />
      <span className="logo__text">ULTRACK</span>
    </Link>
  );
}
