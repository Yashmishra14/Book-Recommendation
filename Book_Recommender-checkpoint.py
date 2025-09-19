#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np
import pandas as pd


# In[6]:


books = pd.read_csv('Data/books.xls', low_memory=False)
users = pd.read_csv('Data/users.xls')
ratings = pd.read_csv('Data/ratings.xls')


# In[7]:


# users.head()


# In[8]:


ratings.head()


# In[9]:


print(books.shape)
print(ratings.shape)
print(users.shape)


# In[10]:


books.isnull().sum()


# In[11]:


users.isnull().sum()


# In[12]:


ratings.isnull().sum()


# In[13]:


books.duplicated().sum()


# In[14]:


users.duplicated().sum()


# In[15]:


ratings.duplicated().sum()


# # Popularity Based Recommender System

# In[16]:


import numpy as np
import pandas as pd


# In[17]:


ratings_with_name=ratings.merge(books,on='ISBN')
ratings_with_name


# In[18]:


book_ratings_df=ratings_with_name.groupby('Book-Title').count()['Book-Rating'].reset_index()
book_ratings_df


# In[19]:


avg_ratings_df=ratings_with_name.groupby('Book-Title').count()['Book-Rating'].reset_index()
avg_ratings_df.rename(columns={'Book-Rating':'avg_ratings'},inplace=True)
avg_ratings_df


# In[20]:


popular_df=book_ratings_df.merge(avg_ratings_df,on='Book-Title')
popular_df


# In[21]:


popular_df[popular_df['Book-Rating']>=250]


# In[22]:


popular_df[popular_df['Book-Rating']>=250].sort_values('avg_ratings',ascending=False)


# In[23]:


popular_df=popular_df[popular_df['Book-Rating']>=250].sort_values('avg_ratings',ascending=False).head(50)
popular_df


# In[24]:


popular_df.merge(books,on='Book-Title').drop_duplicates('Book-Title')


# In[25]:


popular_df=popular_df.merge(books,on='Book-Title').drop_duplicates('Book-Title')[['Book-Title','Book-Author','Image-URL-M','Book-Rating','avg_ratings']]


# In[26]:


#popular_df


# # Collaborative Filtering based Recommender System

# In[27]:


x=ratings_with_name.groupby('User-ID').count()['Book-Rating']>200
ratings_wale_users=x[x].index


# In[28]:


ratings_with_name['User-ID'].isin(ratings_wale_users)


# In[29]:


filtered_ratings = ratings_with_name[ratings_with_name['User-ID'].isin(ratings_wale_users)]
filtered_ratings


# In[30]:


y = filtered_ratings.groupby('Book-Title').count()['Book-Rating']>=50
famous_book = y[y].index
famous_book


# In[31]:


final_ratings = filtered_ratings[filtered_ratings['Book-Title'].isin(famous_book)]
final_ratings


# In[32]:


final_ratings.drop_duplicates()
final_ratings


# In[33]:


pt = final_ratings.pivot_table(index='Book-Title',columns='User-ID',values='Book-Rating')
pt


# In[34]:


pt.fillna(0,inplace=True)
pt


# In[36]:


from sklearn.metrics.pairwise import cosine_similarity


# In[37]:


cosine_similarity(pt)


# In[38]:


similarity_score = cosine_similarity(pt)
similarity_score


# In[39]:


similarity_score.shape


# In[40]:


def recommend(book_name):
    return suggestions


# In[41]:


np.where(pt.index=='1984')[0][0]


# In[42]:


np.where(pt.index=='A Bend in the Road')[0][0]


# In[43]:


np.where(pt.index=='Zoya')[0][0]


# In[44]:


list(enumerate(similarity_score[0]))


# In[45]:


sorted(list(enumerate(similarity_score[0])),key=lambda x:x[1],reverse=True)[1:6]


# In[46]:


import numpy as np

def recommend(book_name):
    # Find the index of the given book in the pivot table
    index = np.where(pt.index == book_name)[0][0]

    # Find the most similar items, sorted by similarity score, excluding the first (which is the book itself)
    similar_items = sorted(list(enumerate(similarity_score[index])), key=lambda x: x[1], reverse=True)[1:6]

    data = []
    for i in similar_items:
        item = []
        temp_df = books[books['Book-Title'] == pt.index[i[0]]].drop_duplicates('Book-Title')
        item.append(temp_df['Book-Title'].values[0])
        item.append(temp_df['Book-Author'].values[0])
        item.append(temp_df['Image-URL-M'].values[0])
        data.append(item)

    return data


# In[47]:


recommend('Message in a Bottle')


# In[48]:


pt.index[545]


# In[49]:


recommend('1984')


# In[50]:


recommend('Message in a Bottle')


# In[51]:


recommend('1984')


# In[52]:


popular_df['Image-URL-M'][0]


# In[53]:


import pickle
pickle.dump(popular_df,open('popular.pkl','wb'))


# In[54]:


import pickle

pickle.dump(pt, open('pt.pkl', 'wb'))
pickle.dump(books, open('books.pkl', 'wb'))
pickle.dump(similarity_score, open('similarity_score.pkl', 'wb'))


# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:




