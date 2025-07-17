<?php
Schema::create('reviews', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->bigInteger('movie_id');
    $table->text('review_text');
    $table->unsignedTinyInteger('rating');
    $table->timestamps();
});
