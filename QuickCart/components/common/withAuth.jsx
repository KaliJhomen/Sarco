import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/server/useAuth'; // Hook to check token validity
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { isAuthenticated, isLoading, error } = useAuth(); // Custom hook to check authentication
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      console.log('isAuthenticated:', isAuthenticated);
      console.log('isLoading:', isLoading);
      console.log('error:', error);

      if (!isLoading && !isAuthenticated) {
        setShowModal(true); // Show the modal if the user is not authenticated
      }
    }, [isAuthenticated, isLoading]);

    const handleModalClose = () => {
      setShowModal(false);
      router.push('/auth/login'); // Redirect to login page after closing the modal
    };

    if (isLoading) {
      return <div>Cargando...</div>; // Show a loading state while checking authentication
    }

    if (!isAuthenticated && !showModal) {
      return null; // Prevent rendering the component if not authenticated
    }

    return (
      <>
        {showModal && (
          <Modal
            title="Sesión expirada"
            message="Tu sesión ha expirado o no tienes acceso. Serás redirigido a la página de inicio de sesión."
            onClose={handleModalClose}
          />
        )}
        {!showModal && <WrappedComponent {...props} />}
      </>
    );
  };
};

export default withAuth;