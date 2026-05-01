import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import SetPasswordModal from './SetPasswordModal';
import { saveAuthSession } from '../lib/authStorage';

const Login = () => {
  const navigate = useNavigate();
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [pendingSession, setPendingSession] = useState(null);

  const handleLoginSuccess = (session) => {
    // If user signed in via Google and doesn't have a password, prompt them
    if (session.needsPassword) {
      setPendingSession(session);
      setShowSetPassword(true);
      return;
    }

    // Normal login — save session and navigate
    saveAuthSession(session);
    navigate('/', { replace: true });
  };

  const handlePasswordComplete = () => {
    // Save the session and navigate regardless of whether they set a password or skipped
    if (pendingSession) {
      saveAuthSession(pendingSession);
    }
    setShowSetPassword(false);
    navigate('/', { replace: true });
  };

  return (
    <>
      <AuthPage onLoginSuccess={handleLoginSuccess} />
      {showSetPassword && pendingSession && (
        <SetPasswordModal
          token={pendingSession.token}
          user={pendingSession.user}
          onComplete={handlePasswordComplete}
        />
      )}
    </>
  );
};

export default Login;