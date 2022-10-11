'use strict';

/**
 * category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({strapi}) => {

    return {
        async findOne(ctx) {

            const {query: {pagination: {page, pageSize}, populate } } = ctx;
            const {id: slug} = ctx.params;
            const categories = await strapi.entityService.findMany('api::category.category', {
                populate: [...populate],
                filters: { slug },
                limit: 1
              });

            if(!categories) return ctx.notFound('Posts is not found');
            
            // created pagination system
            const category = categories[0];
            const posts = category.posts;
            const pageNumber = page ? +page : 1;
            const postsPerPage = pageSize ? pageSize : process.env.CATEGORY_POSTS_PER_PAGE;
            const totalPosts = posts.length;
            const paginatedPosts = posts.splice((pageNumber - 1) * postsPerPage, postsPerPage);

            const response = {
                ...category,
                posts: paginatedPosts,
                pagination: {
                    currentPage: pageNumber,
                    previousPage: pageNumber - 1,
                    nextPage: pageNumber + 1,
                    hasPreviousPage: pageNumber > 1,
                    hasNextPage: pageNumber * postsPerPage < totalPosts,
                    lastPage: Math.ceil(totalPosts / postsPerPage),
                }
            }

            return response;
        }
    }
});
