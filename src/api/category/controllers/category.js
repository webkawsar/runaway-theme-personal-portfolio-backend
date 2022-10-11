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
            
            const category = await strapi.db.query('api::category.category').findOne({
                where : { slug },
                populate: [...populate]
            });

            if(!category) return ctx.notFound('Category is not found');
            
            // created pagination system
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
