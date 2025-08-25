<template>

    <div id="static">
        <main>

            <div>
                <div class="site-logo">
                    <img src="../assets/logo.svg" alt="Velocity Media logo" class="logo">
                    <h2>VELOCITY MEDIA</h2>
                </div>
            </div>

            <video src="../assets/video.mov" muted autoplay loop>
                Kunne ikke laste episk video 😔
            </video>
            <section id="services" v-fade>
                <h1>Våre tjenester</h1>
                <ul>
                    <li>
                        <figure>
                            <img src="../assets/aftermovie.svg" alt="Aftermovie ikon">
                            <figcaption>Film Produksjon</figcaption>
                        </figure>
                    </li>
                    <li>
                        <figure>
                            <img src="../assets/photo.svg" alt="Foto ikon">
                            <figcaption>Bilder</figcaption>
                        </figure>
                    </li>
                    <li>
                        <figure>
                            <img src="../assets/drone.svg" alt="Drone ikon">
                            <figcaption>Dronefilming</figcaption>
                        </figure>
                    </li>

                    <li>
                        <figure>
                            <img src="../assets/camera.svg" alt="Kamera ikon">
                            <figcaption>Flerkamera-<br>Produksjon</figcaption>
                        </figure>
                    </li>

                    <li>
                        <figure>
                            <img src="../assets/grade.svg" alt="Farge gradering ikon">
                            <figcaption>Fargegradering</figcaption>
                        </figure>
                    </li>
                </ul>
                <p>
                    <strong>VELOCITY MEDIA er din partner for profesjonelt visuelt innhold.</strong>
                    <br><br>
                    Vi spesialiserer oss på høykvalitets film- og fotoopptak fra luft, vann, og bakkenivå! Enten det er
                    med drone, kamera, kjøretøymontert rigg eller håndholdte løsninger, hjelper vi deg med det du
                    trenger!
                    <br><br>
                    Vi fanger øyeblikkene som virkelig teller – fra actionfylte motorsportscener og spektakulære
                    arrangementer til skreddersydde reklameproduksjoner.
                    <br><br>
                    Med fokus på presisjon, spenning og kreativitet leverer vi visuelt innhold som engasjerer,
                    inspirerer og imponerer.


                </p>
                <button class="scroll-arrow" @click="scrollToNext('team')">
                    ↓
                </button>
            </section>
            <section id="team" v-fade>
                <h1>Teamet</h1>
                <ul>
                    <li>
                        <figure>
                            <img src="../assets/placeholder.svg" alt="Profilbilde">
                        </figure>
                    </li>
                    <li>
                        <figure>
                            <img src="../assets/placeholder.svg" alt="Profilbilde">
                        </figure>
                    </li>
                    <li>
                        <figure>
                            <img src="../assets/placeholder.svg" alt="Profilbilde">
                        </figure>
                    </li>
                    <li>
                        <figure>
                            <img src="../assets/placeholder.svg" alt="Profilbilde">
                        </figure>
                    </li>
                </ul>
                <button class="scroll-arrow" @click="scrollToNext('contact')">
                    ↓
                </button>
            </section>
            <section id="contact" v-fade>
                <div>
                    <hr>
                    <p>
                        Usikker på hva du trenger, eller har du allerede en idé klar? Uansett
                        hvor langt du har kommet, er vi klare for å høre fra deg. Send oss en
                        melding for en uforpliktende prat eller et tilbud.
                    </p>
                </div>
                <div>
                    <h1>Kontakt oss</h1>
                    <form onsubmit="sendContactForm(event, this)">
                        <input type="text" name="name" placeholder="Navn" required>
                        <input type="tel" name="phone" placeholder="Phone" required>
                        <input type="email" name="email" placeholder="E-post" required>
                        <input type="text" name="subject" placeholder="Emne" required>
                        <textarea name="message" cols="30" rows="10" placeholder="Melding" required></textarea>
                        <button type="submit" name="send">Send</button>
                    </form>
                </div>
            </section>
            <!-- <section id="customers">
        <h1>Disse tar av med <strong>Velocity Media</strong></h1>
        <ul>
            <li>
                <figure>
                    <img src="assets/dot.svg" alt="">
                </figure>
            </li>
            <li>
                <figure>
                    <img src="assets/dot.svg" alt="">
                </figure>
            </li>
            <li>
                <figure>
                    <img src="assets/dot.svg" alt="">
                </figure>
            </li>
        </ul>
    </section> -->
        </main>
        <footer>
            <nav>
                <a href="">
                    <img src="../assets/logo.svg" alt="Velocity Media logo">
                </a>
                <ul>
                    <li>
                        <p>Velocity Media AS</p>
                        <p>935 174 198</p>
                    </li>
                    <li>
                        <p>Fossekallen 28, 3034 Drammen</p>
                        <a href="tel:+4740510830">+47 405 10 830</a>
                        <a href="mailto:william@velocitymedia.no">william@velocitymedia.no</a>
                    </li>
                </ul>
            </nav>
        </footer>



    </div>

</template>

<script>

import fade from '@/directives/fade';

export default {
    directives: {
        fade
    },
    methods: {
        scrollToNext(id) {
            const el = document.getElementById(id);
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY + 150;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }
    }
}

</script>

<style scoped>
#static {
    display: inline;
    text-align: left;



    & * {
        /*font-family: Helvetica, sans-serif;*/
        line-height: 1.5em;
        color: #ffffff;
        margin: 0;
        padding: 0;
    }

    & ul {
        list-style: none;
    }

    & header {
        position: relative;
        height: 32rem;
        overflow: hidden;

        &>video {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            min-width: 100%;
            min-height: 100%;
            filter: brightness(50%);
        }

        &>nav {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            max-width: 64rem;
            margin: 0 auto;
            padding: 2rem 1rem;

            &>a {
                &>img {
                    height: 4rem;
                }
            }
        }
    }

    & main {
        max-width: 64rem;
        margin: 0 auto;
        margin-top: 2rem;
        padding: 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        &>section {
            display: flex;
            flex-flow: column;
            gap: 3rem;
            padding: 15rem 0;

            & h1 {
                text-transform: uppercase;
                font-weight: 900;
            }

            & figure {
                &>img {
                    display: block;
                    margin: 0 auto;
                }

                &>figcaption {
                    text-align: center;
                    text-transform: uppercase;
                    margin-top: 1rem;
                }
            }

            & strong {
                color: #51A2DE;
                font-weight: 900;
            }

            &#services {
                &>ul {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 8rem), 1fr));
                    gap: 2rem;

                    &>li {
                        &>figure {
                            &>img {
                                height: 4rem;
                            }
                        }
                    }
                }
            }

            &#team {
                &>h1 {
                    font-size: 2rem;
                    text-align: center;
                }

                &>ul {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
                    gap: 2rem;

                    &>li {
                        &>figure {
                            &>img {}
                        }
                    }
                }
            }

            &#contact {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
                gap: 2rem;

                &>div {
                    display: flex;
                    flex-flow: column;
                    gap: 2rem;

                    &>hr {
                        border-color: #51A2DE;
                        margin-top: 4.25rem;
                    }

                    &>form {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-template-areas:
                            "name phone"
                            "email subject"
                            "message message"
                            "send .";
                        gap: 1rem;

                        input,
                        textarea {
                            background-color: transparent;
                            border: .1rem solid #555555;
                            padding: 1em 1.5em;
                            font-size: 1rem;
                            min-width: 0;

                            &::placeholder {
                                /* font-family: Helvetica, sans-serif; */
                                color: #555555;
                                font-weight: 700;
                            }

                            &:focus {
                                outline: .2rem solid #555555;
                            }

                            &[name=name] {
                                grid-area: name;
                            }

                            &[name=phone] {
                                grid-area: phone;
                            }

                            &[name=email] {
                                grid-area: email;
                            }

                            &[name=subject] {
                                grid-area: subject;
                            }

                            &[name=message] {
                                grid-area: message;
                            }
                        }

                        button[name=send] {
                            grid-area: send;
                            cursor: pointer;
                            padding: 1em 2em;
                            color: #000000;
                            width: fit-content;
                            font-weight: 900;
                            text-transform: uppercase;
                            border: none;
                        }
                    }
                }
            }

            &#customers {
                &>h1 {
                    text-align: center;
                }

                &>ul {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 8rem), 1fr));
                    gap: 2rem;

                    &>li {
                        &>figure {
                            &>img {
                                height: 4rem;
                            }
                        }
                    }
                }
            }
        }
    }

    footer {
        max-width: 64rem;
        margin: 0 auto;
        padding: 4rem 1rem;

        &>nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;

            &>a {
                &>img {
                    height: 4rem;
                }
            }

            &>ul {
                display: flex;
                flex-flow: column;
                gap: 1rem;

                &>li {
                    text-align: right;

                    &>p {
                        text-transform: uppercase;
                    }

                    &>a {
                        display: block;
                        color: #51A2DE;
                        text-decoration: none;
                        font-weight: 500;
                    }
                }
            }
        }
    }

}

#services {
    & p {
        margin: 0 auto;
        width: 50rem;
        font-size: 1.2rem;
    }

}

.site-logo {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    gap: 1rem;

    & h2 {
        font-size: 3rem;
    }

    & img {
        height: 4rem;
    }
}

.before-fade {
    opacity: 0;
    transform: translateY(20px);
}

.fade-in {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.8s ease-out;
}

.fade-out {
    opacity: 0.3;
    transform: translateY(20px);
    transition: all 0.8s ease-out;
}

.scroll-arrow {
    position: absolute;
    bottom: 9rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    background: none;
    border: none;
    color: #3aaaff;
    cursor: pointer;
    animation: bounce 2s infinite;
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translate(-50%, 0);
    }

    40% {
        transform: translate(-50%, -10px);
    }

    60% {
        transform: translate(-50%, -5px);
    }
}
</style>