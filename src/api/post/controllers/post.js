'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({strapi}) => {

    return {
        async findOne(ctx) {

            const {query: { populate } } = ctx;
            const {id: slug} = ctx.params;
            
            const post = await strapi.db.query('api::post.post').findOne({
                where : { slug },
                populate: [...populate]
            });

            if(!post) return ctx.notFound('Post is not found');
            
            return post;
        }
    }
});
