import styles from '../styles/DropAnimation.module.scss';

const DropAnimation = ({ audioLevel }) => {
  // Adjust the scaling factor to control size
  const size = Math.min(50, audioLevel / 2); // Adjust this factor to control the size scaling

  return (
    <div className={styles.container}>
      <div
        className={styles.drop}
        style={{ width: `${size}vmin`, height: `${size}vmin` }}
      ></div>
    </div>
  );
};

export default DropAnimation;
