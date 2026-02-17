import { test as base } from '@playwright/test';
import RegisterPage from '../../pom/pages/RegisterPage';
import SignInPage from '../../pom/pages/SignInPage';
import ForgotPasswordPage from '../../pom/pages/ForgotPasswordPage';
import OpenIdLoginPage from '../../pom/pages/OpenIdLoginPage';
import DashboardPage from '../../pom/pages/DashboardPage';
import NewRepoPage from '../../pom/pages/NewRepoPage';
import RepoDetailsPage from '../../pom/pages/RepoDetailsPage';


type PageObjects = {
  registerPage: RegisterPage;
  signInPage: SignInPage;
  forgotPasswordPage: ForgotPasswordPage;
  openIdLoginPage: OpenIdLoginPage;
  dashboardPage: DashboardPage;
  newRepoPage: NewRepoPage;
  repoDetailsPage: RepoDetailsPage;
};

export const test = base.extend<PageObjects>({
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigateTo();
    await use(registerPage);
  },

  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await signInPage.navigateTo();
    await use(signInPage);
  },

  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await use(forgotPasswordPage);
  },

  openIdLoginPage: async ({ page }, use) => {
    const openIdLoginPage = new OpenIdLoginPage(page);
    await use(openIdLoginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  newRepoPage: async ({ page }, use) => {
    const newRepoPage = new NewRepoPage(page);
    await use(newRepoPage);
  },

  repoDetailsPage: async ({ page }, use) => {
    const repoDetailsPage = new RepoDetailsPage(page);
    await use(repoDetailsPage);
  },

});

export { expect } from '@playwright/test';
