'use strict';

/**
 * tag controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tag.tag', ({strapi}) => {

    return {
        async findOne(ctx) {

            const {query: {pagination: {page, pageSize}, populate } } = ctx;
            const {id: slug} = ctx.params;
            
            const tag = await strapi.db.query('api::tag.tag').findOne({
                where : { slug },
                populate: [...populate]
            });

        
            if(!tag) return ctx.notFound('Tag is not found');
            
            // created pagination system
            const posts = tag.blogs;
            const pageNumber = page ? +page : 1;
            const postsPerPage = pageSize ? pageSize : process.env.CATEGORY_POSTS_PER_PAGE;
            const totalPosts = posts.length;
            const sortedPosts = posts.sort(function(post1, post2){return post2.id - post1.id});
            const paginatedPosts = sortedPosts.splice((pageNumber - 1) * postsPerPage, postsPerPage);
            

            const response = {
                ...tag,
                blogs: paginatedPosts,
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
