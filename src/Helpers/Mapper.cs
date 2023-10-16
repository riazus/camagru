using System.Reflection;

namespace back.Helpers
{
    public interface IMapper
    {
        TDestination Map<TSource, TDestination>(TSource source, TDestination destination)
        where TSource : class
        where TDestination : class;
        TDestination MapOnlyNotNull<TSource, TDestination>(TSource source, TDestination destination)
        where TSource : class
        where TDestination : class;
        public IList<TDestination> Map<TSource, TDestination>(IEnumerable<TSource> source, IList<TDestination> destination)
        where TSource : class
        where TDestination : class, new();
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
                    .SingleOrDefault(prop => prop.Name == sourceProperty.Name && prop.PropertyType == sourceProperty.PropertyType);

                if (destinationProperty != null && destinationProperty.CanWrite)
                {
                    destinationProperty.SetValue(destination, sourceProperty.GetValue(source));
                }
            }

            return destination;
        }

        public TDestination MapOnlyNotNull<TSource, TDestination>(TSource source, TDestination destination)
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
                var val = sourceProperty.GetValue(source);

                if (val == null) { continue; }
                if (val is string && object.Equals(val, "")) { continue; }

                PropertyInfo destinationProperty = destinationType.GetProperties()
                    .SingleOrDefault(prop => prop.Name == sourceProperty.Name && prop.PropertyType == sourceProperty.PropertyType);

                if (destinationProperty != null && destinationProperty.CanWrite)
                {
                    destinationProperty.SetValue(destination, sourceProperty.GetValue(source));
                }
            }

            return destination;
        }

        public IList<TDestination> Map<TSource, TDestination>(IEnumerable<TSource> source, IList<TDestination> destination)
            where TSource : class
            where TDestination : class, new()
        {
            if (source == null || destination == null)
            {
                throw new ArgumentNullException("Source and destination objects must not be null.");
            }

            // Clear the destination list if it's not already empty
            destination.Clear();

            foreach (var sourceItem in source)
            {
                var destinationItem = new TDestination();
                destinationItem = Map(sourceItem, destinationItem);
                destination.Add(destinationItem);
            }

            return destination;
        }
    }
}
