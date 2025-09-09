import { render, screen } from '@testing-library/react';
import DemandeForm from './DemandeForm';
import { AuthContext } from '../contexts/AuthContext';

test('affiche le formulaire de demande', () => {
  render(
    <AuthContext.Provider value={{ token: 'fake-token' }}>
      <DemandeForm />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/description du projet/i)).toBeInTheDocument();
});
