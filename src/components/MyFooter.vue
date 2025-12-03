<template>
  <footer class="footer">
    <div class="footer__content container">
      <div class="footer__about">
        <h2 class="footer__title">Recettes Délicieuses</h2>
        <p>Découvrez des recettes simples et savoureuses pour tous les jours.</p>
      </div>

      <div class="footer__social">
        <h3>Suivez-nous</h3>
        <div class="footer__icons">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <p>© 2025 Recettes Délicieuses. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<script setup>
// Pas de script nécessaire pour ce footer simple
</script>

<style lang="scss" scoped>
.footer {
  background-color: #fffcf2;
  color: #333;
  padding: 3rem 1rem 1rem;
  font-family: 'Helvetica Neue', sans-serif;
  border-top: 4px solid #f08a5d;

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;

    & > div {
      flex: 1 1 200px;
    }
  }

  &__title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #f08a5d;
  }

  &__links ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 0.5rem;

      a {
        text-decoration: none;
        color: #333;
        transition: color 0.3s;

        &:hover {
          color: #f08a5d;
        }
      }
    }
  }

  &__icons {
    display: flex;
    gap: 1rem;

    a {
      font-size: 1.2rem;
      color: #333;
      transition: color 0.3s;

      &:hover {
        color: #f08a5d;
      }
    }
  }

  &__bottom {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.9rem;
    color: #999;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .footer .container {
    flex-direction: column;
    text-align: center;

    & > div {
      flex: unset;
    }
  }
}
</style>
