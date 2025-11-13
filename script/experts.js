document.addEventListener('DOMContentLoaded', () => {
    const tagButtons = document.querySelectorAll('.tag-btn');
    const cards = document.querySelectorAll('.card');

    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tagButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const selectedTag = button.getAttribute('data-tag');
            
            cards.forEach(card => {
                const cardTags = card.getAttribute('data-tags').split(' ');
                
                if (selectedTag === 'all' || cardTags.includes(selectedTag)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add smooth scroll to read more links
    // document.querySelectorAll('.read-more').forEach(link => {
    //     link.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         // Here you can add the functionality to show more detailed content
    //         // For now, we'll just show an alert
    //         alert('This would link to a detailed article about the topic.');
    //     });
    // });
}); 