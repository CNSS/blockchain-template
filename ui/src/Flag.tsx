import { Layout } from './Layout.tsx';
import styles from './Flag.module.scss';
import { className } from './utils.tsx';
import nes from './nes.tsx';

const Flag = () => {
    return (
        <Layout>
            <section className={className(nes.container, styles.container)}>
                <section className={className(styles.messageList)}>
                    <section className={className(styles.messageRight)}>
                        <div className={className(nes.rightBalloon, styles.messageNesBalloon)}>
                            <p>
                                Ciao, hacker! I'm the flag bot! What can I do for you?
                            </p>
                        </div>
                        <i className={className(nes.squirtle, styles.messageRightI)}></i>
                    </section>

                    <section className={className(styles.messageLeft)}>
                        <i className={className(nes.mario, styles.messageLeftI)}></i>
                        <div className={className(nes.leftBalloon, styles.messageNesBalloon)}>
                            <p>Hello! I want the flag pleazzzzzzz~</p>
                        </div>
                    </section>

                    <section className={className(styles.messageRight)}>
                        <div className={className(nes.rightBalloon)}>
                            <p>
                                {'flag{***}'}
                            </p>
                        </div>
                        <i className={className(nes.squirtle, styles.messageRightI)}></i>
                    </section>

                    <section className={className(styles.messageLeft)}>
                        <i className={className(nes.mario, styles.messageLeftI)}></i>
                        <div className={className(nes.leftBalloon)}>
                            <p>Thank you……or should I?</p>
                        </div>
                    </section>
                </section>
            </section>
        </Layout>
    );
};

export { Flag };