import { Button } from '@/components/Button';
import { ButtonLink } from '@/components/Button/Button';
import { Input } from '@/components/Input';
import { Spacer, Wrapper } from '@/components/Layout';
import { fetcher } from '@/lib/fetch';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './ForgetPassword.module.css';

const NewPassword = ({ token }) => {
  const passwordRef = useRef();
  // 'loading' | 'success'
  const [status, setStatus] = useState();
  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setStatus('loading');
      try {
        await fetcher('/api/user/password/reset', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            password: passwordRef.current.value,
          }),
        });
        setStatus('success');
      } catch (e) {
        toast.error(e.message);
        setStatus(undefined);
      }
    },
    [token]
  );
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Redefinição de Senha</h1>
      {status === 'success' ? (
        <>
          <p className={styles.subtitle}>
          Sua senha foi atualizada com sucesso.
          </p>
        </>
      ) : (
        <>
          <p className={styles.subtitle}>
          Digite uma nova senha para sua conta
          </p>
          <Spacer size={1} />
          <form onSubmit={onSubmit}>
            <Input
              ref={passwordRef}
              htmlType="password"
              autoComplete="new-password"
              placeholder="Sua Senha"
              ariaLabel="New Password"
              size="large"
              required
            />
            <Spacer size={0.5} axis="vertical" />
            <Button
              htmlType="submit"
              className={styles.submit}
              type="success"
              size="large"
            >
              Alterar Senha
            </Button>
          </form>
        </>
      )}
      <Spacer size={0.25} axis="vertical" />
      <Link href="/login" passHref>
        <ButtonLink type="success" size="large" variant="ghost">
          Ir para a Entrada
        </ButtonLink>
      </Link>
    </div>
  );
};

const BadLink = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Link Inválido</h1>
      <p className={styles.subtitle}>
      Parece que você clicou em um link inválido. Por favor feche esta janela e tente novamente.
      </p>
      <Spacer size={1} />
      <Link href="/login" passHref>
        <ButtonLink type="success" size="large" variant="ghost">
        Ir para a Entrada
        </ButtonLink>
      </Link>
    </div>
  );
};

const ForgetPasswordToken = ({ valid, token }) => {
  return (
    <Wrapper className={styles.root}>
      {valid ? <NewPassword token={token} /> : <BadLink />}
    </Wrapper>
  );
};

export default ForgetPasswordToken;
