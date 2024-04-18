import { Layout } from './Layout.tsx';
import styles from './Flag.module.scss';
import { api, ApiError, className } from './utils.tsx';
import nes from './nes.tsx';
import React from 'react';

interface FlagResponse {
    success: boolean;
    flag: string;
}

const Flag = () => {
    const [flag, setFlag] = React.useState<FlagResponse | undefined>(undefined);
    const [rateLimit, setRateLimit] = React.useState<boolean>(false);

    React.useEffect(() => {
        api<FlagResponse>("GET", "flag")
            .then((flag) => {
                setRateLimit(false);
                setFlag(flag);
            })
            .catch((err: ApiError) => {
                if (err.apiError.status == 429) {
                    setRateLimit(true);
                    setFlag(undefined);
                    return;
                }
                setRateLimit(false);
                setFlag(undefined);
            });
    }, []);

    if (flag === undefined) {
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

                        {
                            rateLimit && (
                                <section className={className(styles.messageRight)}>
                                    <div className={className(nes.rightBalloon, styles.messageNesBalloon)}>
                                        <p>Slow down MAN!!!</p>
                                    </div>
                                    <i className={className(nes.squirtle, styles.messageRightI)}></i>
                                </section>
                            )
                        }
                    </section>
                </section>
            </Layout>
        )
    }

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
                        <div className={className(nes.rightBalloon, styles.messageNesBalloon)}>
                            {
                                flag.success ? (
                                    <p><b className={className(nes.text, nes.primary)}>{flag.flag}</b></p>
                                ) : (
                                    <p>{flag.flag}</p>
                                )
                            }
                        </div>
                        <i className={className(nes.squirtle, styles.messageRightI)}></i>
                    </section>

                    <section className={className(styles.messageLeft)}>
                        <i className={className(nes.mario, styles.messageLeftI)}></i>
                        <div className={className(nes.leftBalloon, styles.messageNesBalloon)}>
                            {
                                flag.success ? (
                                    <p>Thank you!</p>
                                ) : (
                                    <p>Really?</p>
                                )
                            }
                        </div>
                    </section>
                </section>
            </section>
        </Layout>
    );
};

export { Flag };