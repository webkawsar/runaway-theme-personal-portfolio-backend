'use strict';

/**
 * blog controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog.blog', ({strapi}) => {

    return {
        async findOne(ctx) {

            const {query: { populate } } = ctx;
            const {id: slug} = ctx.params;
            
            const post = await strapi.db.query('api::blog.blog').findOne({
                where : { slug },
                populate: [...populate]
            });

            if(!post) return ctx.notFound('Post is not found');
            
            return post;
        }
    }
});