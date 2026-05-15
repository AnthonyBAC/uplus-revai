import s from './SecurityPanel.module.css';

export default function ForgotPasswordPanel() {
  return (
    <>
      <span className={s.rightTag}>● SEGURIDAD DE TU CUENTA</span>

      <h2 className={s.title}>
        Tu cuenta está <span className={s.accent}>protegida</span>.
      </h2>

      <ul className={s.list}>
        <li className={s.item}>
          <span className={s.icon}>🔐</span>
          <div>
            <p className={s.itemTitle}>Enlace de un solo uso</p>
            <p className={s.itemDesc}>
              El enlace que enviamos expira en 15 minutos y solo funciona una vez.
            </p>
          </div>
        </li>
        <li className={s.item}>
          <span className={s.icon}>📬</span>
          <div>
            <p className={s.itemTitle}>Revisa tu spam</p>
            <p className={s.itemDesc}>
              Si no ves el correo en tu bandeja principal, revisa la carpeta de spam.
            </p>
          </div>
        </li>
        <li className={s.item}>
          <span className={s.icon}>🛡️</span>
          <div>
            <p className={s.itemTitle}>Nunca pedimos tu contraseña</p>
            <p className={s.itemDesc}>
              U+ Revai jamás te solicitará tu contraseña por correo o chat.
            </p>
          </div>
        </li>
      </ul>
    </>
  );
}
