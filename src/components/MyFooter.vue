<template>
  <footer class="footer">
    <div class="footer__content container">
      <div class="footer__about">
        <h2 class="footer__title">Recettes Délicieuses</h2>
        <p class="footer__text">Découvrez des recettes simples et savoureuses pour tous les jours.</p>
      </div>

      <div class="footer__social">
        <h3 class="footer__subtitle">Suivez-nous</h3>
        <div class="footer__icons">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <p>© 2026 Recettes Délicieuses. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: #fffcf2;
  color: #333;
  padding: 3rem 1.5rem 1.5rem;
  border-top: 4px solid #f08a5d;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    // Mobile first : une seule colonne
    grid-template-columns: 1fr; 
    gap: 2.5rem;
    text-align: center;
  }

  &__title {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
    color: #f08a5d;
  }

  &__text {
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
  }

  &__subtitle {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  &__icons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;

    a {
      font-size: 1.4rem;
      color: #333;
      transition: transform 0.3s, color 0.3s;

      &:hover {
        color: #f08a5d;
        transform: translateY(-3px);
      }
    }
  }

  &__bottom {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(0,0,0,0.05);
    text-align: center;
    font-size: 0.85rem;
    color: #999;
  }

  /* Responsive Desktop (768px et plus) */
  @media (min-width: 768px) {
    padding: 4rem 2rem 2rem;

    .container {
      // Passage en deux colonnes sur desktop
      grid-template-columns: 1fr 1fr;
      text-align: left;
    }

    &__text {
      margin: 0;
    }

    &__icons {
      justify-content: flex-end;
    }

    &__social {
      text-align: right;
    }
  }
}
</style>