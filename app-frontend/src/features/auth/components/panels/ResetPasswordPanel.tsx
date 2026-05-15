import s from './SecurityPanel.module.css';

export default function ResetPasswordPanel() {
  return (
    <>
      <span className={s.rightTag}>● CREA UNA CONTRASEÑA SEGURA</span>
      <h2 className={s.title}>
        Una buena contraseña es tu <span className={s.accent}>primera línea</span> de defensa.
      </h2>
      <ul className={s.list}>
        <li className={s.item}>
          <span className={s.icon}>🔤</span>
          <div>
            <p className={s.itemTitle}>Mínimo 8 caracteres</p>
            <p className={s.itemDesc}>Mientras más larga, más difícil de adivinar.</p>
          </div>
        </li>
        <li className={s.item}>
          <span className={s.icon}>🔢</span>
          <div>
            <p className={s.itemTitle}>Mezcla letras y números</p>
            <p className={s.itemDesc}>Combina mayúsculas, minúsculas, números y símbolos.</p>
          </div>
        </li>
        <li className={s.item}>
          <span className={s.icon}>🚫</span>
          <div>
            <p className={s.itemTitle}>No reutilices contraseñas</p>
            <p className={s.itemDesc}>Usa una contraseña única para cada servicio que uses.</p>
          </div>
        </li>
      </ul>
    </>
  );
}
