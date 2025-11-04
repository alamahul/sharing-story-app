import LoginPage from '../views/login-page.js';
import RegisterPage from '../views/register-page.js';
import HomePage from '../views/home-page.js';
import AddStoryPage from '../views/add-story-page.js';
import AboutPage from '../views/about-page.js'; 
import NotFoundPage from '../views/not-found-page.js';
import StoryListPage from '../views/story-list-page.js';
import SavedStoriesPage from '../views/saved-stories-page.js';
import StoryDetailPage from '../views/story-detail-page.js';

const routes = {
    '/': HomePage,
    '/home': HomePage,
    '/story-list': StoryListPage, 
    '/saved-stories': SavedStoriesPage,
    '/story-detail/:id': StoryDetailPage,
    '/login': LoginPage,
    '/register': RegisterPage,
    '/add-story': AddStoryPage,
    '/about': AboutPage,
    '/404': NotFoundPage,
};

export default routes;