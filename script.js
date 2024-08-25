document.getElementById("fileUpload").addEventListener("change", function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        const book = ePub(selectedFile);
        const rendition = book.renderTo("content", {
            width: "100%",
            height: "100%",
            spread: "none"
        });

        rendition.display().then(function() {
            try {
                updatePageInfo(rendition);

                document.getElementById("nextButton").addEventListener("click", function() {
                    rendition.next().then(() => {
                        updatePageInfo(rendition);
                    }).catch(function(error) {
                        console.error('Error navigating to the next page:', error);
                    });
                });

                document.getElementById("prevButton").addEventListener("click", function() {
                    rendition.prev().then(() => {
                        updatePageInfo(rendition);
                    }).catch(function(error) {
                        console.error('Error navigating to the previous page:', error);
                    });
                });

                rendition.on('relocated', function() {
                    updatePageInfo(rendition);
                });

                document.addEventListener("keydown", function(event) {
                    if (event.key === "ArrowRight") {
                        rendition.next().then(() => {
                            updatePageInfo(rendition);
                        }).catch(function(error) {
                            console.error('Error navigating to the next page:', error);
                        });
                    } else if (event.key === "ArrowLeft") {
                        rendition.prev().then(() => {
                            updatePageInfo(rendition);
                        }).catch(function(error) {
                            console.error('Error navigating to the previous page:', error);
                        });
                    }
                });

            } catch (error) {
                console.error('Error loading the book:', error);
            }
        });
    }
});

function updatePageInfo(rendition) {
    try {
        const location = rendition.currentLocation();
        if (location && location.start && location.start.index !== undefined) {
            const pageNumber = location.start.index + 1;
            document.getElementById("pageInfo").textContent = `Page: ${pageNumber}`;
        } else {
            console.error('Unable to get page location.');
        }
    } catch (error) {
        console.error('Error updating page number:', error);
    }
}
