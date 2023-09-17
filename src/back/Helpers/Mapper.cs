using System.Reflection;

namespace back.Helpers
{
    public interface IMapper
    {
        TDestination Map<TSource, TDestination>(TSource source, TDestination destination)
        where TSource : class
        where TDestination : class;
        public IList<TDestination> Map<TSource, TDestination>(IEnumerable<TSource> source, IList<TDestination> destination)
        where TSource : class
        where TDestination : class;
    }

    public class Mapper : IMapper
    {
        public TDestination Map<TSource, TDestination>(TSource source, TDestination destination)
        where TSource : class
        where TDestination : class
        {
            if (source == null || destination == null)
            {
                throw new ArgumentNullException("Source and destination objects must not be null.");
            }

            Type sourceType = typeof(TSource);
            Type destinationType = typeof(TDestination);

            foreach (PropertyInfo sourceProperty in sourceType.GetProperties())
            {
                PropertyInfo destinationProperty = destinationType.GetProperties()
                    .FirstOrDefault(prop => prop.Name == sourceProperty.Name && prop.PropertyType == sourceProperty.PropertyType);

                if (destinationProperty != null && destinationProperty.CanWrite)
                {
                    destinationProperty.SetValue(destination, sourceProperty.GetValue(source));
                }
            }

            return destination;
        }

        public IList<TDestination> Map<TSource, TDestination>(IEnumerable<TSource> source, IList<TDestination> destination)
            where TSource : class
            where TDestination : class
        {
            throw new NotImplementedException();
        }
    }
}
