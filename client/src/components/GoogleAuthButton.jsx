import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleAuthButton = ({ onError }) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/');
    } catch (error) {
      const msg =
        error.response?.data?.message || 'Google sign-in failed. Please try again.';
      if (onError) onError(msg);
    }
  };

  const handleError = () => {
    if (onError) onError('Google sign-in was cancelled or failed.');
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        width="320"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleAuthButton;