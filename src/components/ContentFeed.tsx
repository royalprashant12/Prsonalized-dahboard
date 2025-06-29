import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../store/store';
import { toggleFavorite } from '../store/slices/contentSlice';
import { addFavorite, removeFavorite } from '../store/slices/userPreferencesSlice';
import ContentCard from './ContentCard';

const ContentFeed: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.content);
  const { query, results } = useSelector((state: RootState) => state.search);

  const displayItems = query ? results : items;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // In a real app, you would reorder the items here
    console.log('Item reordered:', result);
  };

  const handleToggleFavorite = (itemId: string) => {
    // Find the item to check its current favorite status
    const item = displayItems.find(item => item.id === itemId);

    if (item) {
      // Toggle the favorite status in content state
      dispatch(toggleFavorite(itemId));

      // Also update user preferences
      if (item.isFavorite) {
        dispatch(removeFavorite(itemId));
      } else {
        dispatch(addFavorite(itemId));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" data-testid="content-feed">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {query ? 'Search Results' : 'Personalized Feed'}
          </h2>
          <span className="text-gray-600 dark:text-gray-400">
            {displayItems.length} items
          </span>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="content-feed">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {displayItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging
                            ? provided.draggableProps.style?.transform
                            : 'none',
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ContentCard
                            item={item}
                            onToggleFavorite={() => handleToggleFavorite(item.id)}
                          />
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {displayItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {query ? 'No search results found.' : 'No content available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentFeed; 