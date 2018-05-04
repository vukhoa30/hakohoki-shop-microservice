/*
Create table promotions (
    id serial primary key,
    start_at timestamp,
    end_at timestamp,
    name varchar(100)
);
Create table products_prices (
    promotion_id integer,
    product_id varchar(24),
    new_price float,
    primary key (promotion_id, product_id)
);
Create table products_gifts (
    promotion_id integer,
    product_id varchar(24),
    gift_id varchar(24),
    primary key (promotion_id, product_id, gift_id)
);
*/